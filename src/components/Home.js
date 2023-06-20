import React, { useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import { useNavigate } from "react-router";

const Home = ({ setResult }) => {
    const [fullName, setFullName] = useState("");
    const [currentPosition, setCurrentPosition] = useState("");
    const [currentLength, setCurrentLength] = useState(1);
    const [currentTechnologies, setCurrentTechnologies] = useState("");
    const [loading, setLoading] = useState(false);
    const [resumeLanguage, setResumeLanguage] = useState("");
    const [companyInfo, setCompanyInfo] = useState([
        { name: "", position: "" }
    ]);
    const navigate = useNavigate();

    //👇🏻 updates the state with user's input
    const handleAddCompany = () =>
    setCompanyInfo([...companyInfo, { name: "", position: "" }]);

    //👇🏻 removes a selected item from the list
    const handleRemoveCompany = (index) => {
    const list = [...companyInfo];
    list.splice(index, 1);
    setCompanyInfo(list);
    };
    //👇🏻 updates an item within the list
    const handleUpdateCompany = (e, index) => {
    const { name, value } = e.target;
    const list = [...companyInfo];
    list[index][name] = value;
    setCompanyInfo(list);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = {
            fullName,
            currentPosition,
            currentLength,
            currentTechnologies,
            workHistory: companyInfo,
        }
        axios
            .post(`${process.env.REACT_APP_API_URL}/resume/create`, formData, {})
            .then((res) => {
                if (res.data.message) {
                    setResult(res.data.data);
                    navigate("/resume");
                }
            })
            .catch((err) => console.error(err));
        setLoading(true);
    };

    //👇🏻 Renders the Loading component you submit the form
    if (loading) {
        return <Loading />;
    }
    return (
        <div className='app mx-auto flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 pt-8 pb-11'>
            <h1 className='text-3xl md:text-5xl font-bold mb-2'>CVPal</h1>
            <p className='mb-5 text-lg'>Genera un curriculum con ChatGPT en segundos</p>
            <form
                onSubmit={handleFormSubmit}
                method='POST'
                encType='multipart/form-data'
                className='w-full max-w-md'
            >
                <label htmlFor='fullName' className='font-bold mb-1'>Tu nombre completo:</label>
                <input
                    type='text'
                    required
                    name='fullName'
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='w-full mb-5 p-2 border-2 border-gray-300 rounded'
                />
                <div className='nestedContainer flex flex-col space-y-5'>
                    <div>
                        <label htmlFor='currentPosition' className='font-bold mb-1'>Tu rol actual:</label>
                        <input
                            type='text'
                            required
                            name='currentPosition'
                            className='currentInput w-full p-2 border-2 border-gray-300 rounded'
                            value={currentPosition}
                            onChange={(e) => setCurrentPosition(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='currentLength' className='font-bold mb-1'>¿Cuánto tiempo llevas en este rol? (años)</label>
                        <input
                            type='number'
                            required
                            name='currentLength'
                            className='currentInput w-full p-2 border-2 border-gray-300 rounded'
                            value={currentLength}
                            onChange={(e) => setCurrentLength(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='currentTechnologies' className='font-bold mb-1 mr-2'>Tecnologias que usas:</label>
                        <input
                            type='text'
                            required
                            name='currentTechnologies'
                            className='currentInput w-full p-2 border-2 border-gray-300 rounded'
                            value={currentTechnologies}
                            onChange={(e) => setCurrentTechnologies(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <h3 className='text-xl font-bold my-4'>Empresas en las que has trabajado:</h3>
                    {companyInfo.map((company, index) => (
                    <div className='nestedContainer flex flex-col space-y-5' key={index}>
                        <div className='companies'>
                            <label htmlFor='name' className='font-bold mb-1'>Empresa:</label>
                            <input
                                type='text'
                                name='name'
                                required
                                onChange={(e) => handleUpdateCompany(e, index)}
                                className='w-full p-2 border-2 border-gray-300 rounded'
                            />
                        </div>
                        <div className='companies'>
                            <label htmlFor='position' className='font-bold mb-1'>Rol:</label>
                            <input
                                type='text'
                                name='position'
                                required
                                onChange={(e) => handleUpdateCompany(e, index)}
                                className='w-full p-2 border-2 border-gray-300 rounded'
                            />
                        </div>

                        <div className='btn__group flex space-x-4 mt-2'>
                            {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                                <button id='addBtn' onClick={handleAddCompany} className='bg-blue-500 text-white font-normal py-1 px-2 rounded hover:bg-blue-700'>
                                    Añadir
                                </button>
                            )}
                            {companyInfo.length - 1 === index && companyInfo.length > 1 && (
                                <button id='deleteBtn' onClick={() => handleRemoveCompany(index)} className='bg-red-500 text-white font-normal py-1 px-2 rounded hover:bg-red-700'>
                                    Borrar
                                </button>
                            )}
                        </div>

                        {index < companyInfo.length - 1 && <hr className='my-4 border-t-2 border-gray-300'/>}
                    </div>
                ))}
                </div>

                <div className="mt-6">
                    <label htmlFor='resumeLanguage' className='block text-sm font-medium text-gray-700'>
                        ¿En qué idioma quieres tu curriculum?
                    </label>
                    <select
                        id='resumeLanguage'
                        name='resumeLanguage'
                        required
                        className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        value={resumeLanguage}
                        onChange={(e) => setResumeLanguage(e.target.value)}
                    >
                        <option value='english'>Inglés</option>
                        <option value='spanish'>Español</option>
                    </select>
                </div>

                <button className='w-full py-3 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-700 mt-5'>
                  CREAR CV
                </button>
            </form>
        </div>
    );
};

export default Home;