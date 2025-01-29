import { useContext } from 'react';
import { styles } from "../styles";
import { context } from "../App";
import { aboutMe, skills } from '../constants';
import Tilt from 'react-parallax-tilt';

interface SkillCardProps {
    title: string,
    icon: string,
}

const SkillCard = ( { title, icon }: SkillCardProps ) => {	
    const { isLight } = useContext(context);
	return (
		<Tilt className={`${isLight ? "blood-blue-gradient" : "rose-sky-gradient" } xs:w-[250px] w-full p-[1px] bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex items-center flex-col`} glareColor={isLight ? '#FF7272': '#A91079'} glareEnable={true} gyroscope={true} glareBorderRadius='20px' glareMaxOpacity={0.5} glarePosition='all' perspective={500} style={{transformStyle: "preserve-3d"}}>
                <img src={icon} alt={title} className='w-56 h-40 object-contain pointer-events-none' style={{transform: "translateZ(100px)" }} />
                <h3 className={`${isLight ? "text-white" : "text-black" } text-[20px] font-bold text-center`} style={{transform: "translateZ(50px)" }}>{title}</h3>
		</Tilt>
	)
}


const About = () => {
    const { isLight } = useContext(context);

    return (
        <div id="about" className={`mt-10 ${styles.paddingX} max-w-7xl mx-auto flex flex-col items-start justify-between`}>
            <p className={`${styles.sectionSubText} ${isLight ? "text-black-200" : "text-white-100" } mt-10 font-semibold`}>About Me</p>
            <h2 className={`${styles.sectionHeadText} ${isLight ? "text-black-200" : "text-white-100" } mb-10`}>Introduction.</h2>
            <div className={`${isLight ? "text-secondary-text-light" : "text-secondary-dark" } text-[17px] max-w-5xl leading-[30px] md:ml-3`}>
                {aboutMe.split('\n').map((para, index) => (
                    <p key={index}>&nbsp;&nbsp;&nbsp;{para}</p>
                ))}
            </div>
            <p className={`mt-20 mb-5 sm:mb-0 invisible ${isLight ? "text-secondary-text-light" : "text-secondary-dark" } text-[17px] max-w-3xl leading-[30px] md:ml-3 italic`}>(Tilt your phone to see some magic)</p>
			<div className='mb-20 flex flex-wrap gap-10'>
				{skills.map((skill, index) => (
					<SkillCard key={index} title={skill.title} icon={skill.icon} />
				))}	
			</div>
        </div>
    )
}

export default About;