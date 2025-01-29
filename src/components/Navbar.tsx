import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../styles';
import { logo, menu, close } from '../assets';
import { context } from '../App';

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const { isLight, setIsLight } = useContext(context);
    const navLinks = ["About", "Skills", "Projects"];

	const navigate = useNavigate();

	return (
		<nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 ${ isLight ? "bg-white" : "bg-black" } bg-opacity-60 backdrop-blur`}>
			<div className='w-full flex justify-between items-center mx-auto'>
				<Link to='/' className='flex items-center gap-2'
					onClick={() => {
						setActive("");
						window.scrollTo(0, 0);
					}}>
					<img src={logo} alt="logo" className='w-9 h-9 object-contain'/>
					<p className={`${isLight ? "text-black-100" : "text-white-100"} text-[18px] font-bold cursor-pointer`}>Aayush Gupta</p>
				</Link>
				<button onClick={() => setIsLight(!isLight)} className='text-sm ml-4 md:ml-0 md:text-xl flex border-black border-2 rounded-full bg-gray-500'>
					<div className={`bg-yellow-200 rounded-full p-1 ${!isLight ? 'invisible': null}`}>🌞</div>
					<div className={`bg-gray-700 rounded-full p-1 none ${isLight ? 'invisible': null}`}>🌚</div>
				</button>
				
				<ul className='list-none hidden sm:flex flex-row gap-10 justify-center items-center'>
					{navLinks.map((link, linkIdx) => (
						<li key={linkIdx} className={`${active === link && isLight ? `text-secondary-light`: active === link ? `text-secondary-dark`: isLight ? `text-black-100`: `text-white-100`} hover:opacity-75 text-[18px] font-medium cursor-pointer`}
							onClick={() => {
								if (window.location.pathname !== '/') 
            						navigate('/');
								setActive(link);
							}}>
							<a href={`#${link.toLowerCase()}`}>{link}</a>
						</li>
					))}
				</ul>
				<div className='sm:hidden flex flex-1 justify-end items-center'>
					<img src={toggle ? close: menu } alt="menu" className={`${isLight ? "": "invert"} w-[28px] h-[28px] object-contain cursor-pointer`}
					onClick={() => setToggle(!toggle)}/>
					<div className={`${toggle ? "flex": "hidden"} p-6 ${isLight ? "white-gradient" : "black-gradient"} absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
						<ul className='list-none flex items-start flex-col gap-4 w-full'>
							{navLinks.map((link, linkIdx) => (
								<li key={linkIdx} className={`${active === link && isLight ? `text-secondary-light`: active === link ? `text-secondary-dark`: isLight ? `text-black-100`: `text-white-100`} font-poppins font-medium cursor-pointer w-full`}
									onClick={() => {
										setToggle(false);
										if (window.location.pathname !== '/') 
            								navigate('/');
										setActive(link);
									}}>
									<a href={`#${link.toLowerCase()}`} className='flex w-full'>{link}</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</nav>
 	)
}

export default Navbar;