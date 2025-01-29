import { useContext, useState } from 'react';
import { styles } from "../styles";
import { context } from "../App";
import { websites } from '../constants';
import { dropdown, github, popout } from "../assets";

const Websites = () => {
    const { isLight } = useContext(context);
    const [ active, setActive ] = useState<number>(2); 

    return (
        <div id="websites" className="mt-4 max-w-7xl mx-auto flex flex-col items-center justify-center">
            <div className={`${styles.paddingX} w-full flex flex-col items-start justify-between`}>
                <p className={`${styles.sectionSubText} ${isLight ? "text-black-200" : "text-white-100" } mt-10 font-semibold`}>What I made</p>
                <h2 className={`${styles.sectionHeadText} ${isLight ? "text-black-100" : "text-white-100"} mb-16`}>Websites.</h2>
                <div className='flex justify-between items-center gap-10 w-full mb-10 md:p-4'>
                    <div className={`md:p-4 ${isLight ? "border-black" : "border-white"} w-full md:w-1/2`}>
                        {websites.map((website, index) => (
                            <div key={index} className={`p-6 rounded-xl border-2 ${isLight ? "border-black" : "border-white"} flex flex-col items-start justify-center ${active === index ? "" : "hover:cursor-pointer"} gap-6 w-full`} onClick={() => setActive(index)}>
                                <header className='flex justify-between items-center w-full'>
                                    <h3 className={`${styles.sectionSubText} ${isLight ? "text-black-200" : "text-white-100" } text-[1.05rem] md:text-lg font-bold`}>{website.title}</h3>
                                    <img src={dropdown} alt="dropdown" className={`w-8 h-8 md:w-10 md:h-10 ${isLight ? "" : "invert"} ${active === index ? "hidden" : ""}`} />
                                    <div className={`flex justify-end items-center gap-3 md:gap-5 ${isLight ? "" : "invert"} ${active === index ? "" : "hidden"}`}>
                                        <a href={website.link} target="_blank" className={``} >
                                            <img src={popout} alt="websiteLink" className={`w-6 h-6 md:w-8 md:h-8 hover:scale-110 active:scale-[1.2]`} />
                                        </a>
                                        <a href={website.source} target="_blank" className={``} >
                                            <img src={github} alt="githubLink" className={`w-6 h-6 md:w-8 md:h-8 hover:scale-110`} />
                                        </a>
                                    </div>
                                </header>
                                <p className={`${active === index ? '': 'hidden' } ${isLight ? "text-secondary-text-light" : "text-secondary-dark" } text-sm md:text-base max-w-1/2 leading-[30px] md:ml-3`}>{website.description}</p>
                                <div className={`${active === index ? '': 'hidden' } flex gap-2 md:gap-3 w-full justify-center md:justify-end`}>
                                    {website.stack.map((tech, techIndex) => (
                                        <img key={techIndex} src={tech} className='w-7 h-7 md:w-10 md:h-10' />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <iframe src={websites[active].link} className={`hidden sm:block w-[400px] h-[600px] border-2 ${isLight ? "border-black" : "border-white"} rounded-xl mb-5`} >Sorry Error!!</iframe>
                </div>
            </div>
            <iframe src={websites[active].link} className={`my-10 md:hidden w-screen h-[600px] border-2 ${isLight ? "border-black" : "border-white"} rounded-xl mb-5 landscape:hidden`} >Sorry Error!!</iframe>
        </div>
    )
}

export default Websites;