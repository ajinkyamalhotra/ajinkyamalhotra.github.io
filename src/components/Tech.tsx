import { useContext } from 'react';
import { context } from '../App';
import { styles } from "../styles";
import { languages, frameworks } from '../constants';
import './bounce.css';

const Tech = () => {
    const { isLight } = useContext(context);

    return (
        <div id="skills" className={`mt-4 ${styles.paddingX} max-w-7xl mx-auto flex flex-col items-start justify-between`}>
            <p className={`${styles.sectionSubText} ${isLight ? "text-black-200" : "text-white-100" } mt-10 font-semibold`}>My Skills</p><h2 className={`${styles.sectionHeadText} ${isLight ? "text-black-100" : "text-white-100"}`}>Tech Stack.</h2>
            <p className={`${styles.sectionSubText} ${isLight ? "text-black-100" : "text-white-100"} font-semibold mt-4`}>Technical Languages</p>
            <div className='flex flex-row flex-wrap justify-center gap-6 md:gap-16 my-10 w-full'>
                {languages.map((language, index) => (
                    <div key={index} className={`sphere ${isLight ? "mud-gradient" : "invert"} flex items-center justify-center rounded-full p-4`}>
                        <img title={language.title} src={language.icon} alt={language.title} className={`${!isLight && !language.invert ? "invert" : ""} hover:animate-spin w-12 h-12 md:w-20 md:h-20 object-contain`} />
                    </div>
                ))}
            </div>
            <p className={`${styles.sectionSubText} ${isLight ? "text-black-100" : "text-white-100"} font-semibold mt-4`}>Technologies and Frameworks</p>
            <div className='flex flex-row flex-wrap justify-center gap-6 md:gap-16 my-10 w-full'>
                {frameworks.map((framework, index) => (
                    <div key={index} className={`sphere ${isLight ? "mud-gradient" : "invert"} flex items-center justify-center rounded-full p-4`}>
                        <img title={framework.title} src={framework.icon} alt={framework.title} className={`${!isLight && !framework.invert ? "invert" : ""} hover:animate-spin w-12 h-12 md:w-20 md:h-20 object-contain`}  />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tech;