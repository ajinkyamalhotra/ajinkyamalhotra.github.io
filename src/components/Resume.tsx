import { useContext, useEffect } from 'react';
import { Navbar } from '.';
import { context } from '../App';
import { download } from '../assets';
import { Link } from 'react-router-dom';
import { resumeLink } from '../constants';

const Resume = () => {
    const { isLight } = useContext(context);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    async function downloadResume() {
        fetch(resumeLink, {
            mode: 'no-cors',
            method: 'GET'
        }).then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = "AayushGuptaResume.pdf";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
        })
    }

    return (
        <div className={`${ isLight ? "bg-hero-pattern-light" : "bg-hero-pattern-dark" } bg-cover bg-no-repeat bg-center flex flex-col justify-center items-center min-h-screen md:h-full`}>
            <Navbar />
            <div className='relative mt-24'>
                <iframe className='w-[355px] h-[500px] md:w-[826px] md:h-[1160px] rounded-xl' src={resumeLink}></iframe>
                <img src={download} alt="download" onClick={downloadResume} className="w-10 h-10 md:w-12 md:h-12 bg-[#404040] hover:cursor-pointer hover:bg-[#474847] absolute top-2 left-2 text-xs md:text-lg font-semibold p-3 rounded-xl" />
            </div>
            <div className='w-[355px] md:w-[826px] flex justify-evenly items-center'>
                <Link to="/" className={`${isLight ? "bg-black-200 text-white-100 hover:text-secondary-dark " : "bg-white-100 text-black-200 hover:text-secondary-light"} my-5 text-xs md:text-lg font-semibold p-3 rounded-xl`}>Back</Link>
                <button onClick={downloadResume} className={`${isLight ? "bg-black-200 text-white-100 hover:text-secondary-dark " : "bg-white-100 text-black-200 hover:text-secondary-light"} my-5 text-xs md:text-lg font-semibold p-3 rounded-xl`}>Download</button>
            </div>
        </div>
    )
}

export default Resume