import { SvgIconComponent } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface RouteProps {
    Icon: SvgIconComponent;
    title: string;
    target?: string;
}

const routes: RouteProps[] = [
    {Icon: AddCircleIcon, title: 'Matches'},
    {Icon: PersonIcon, title: 'Players'},
    {Icon: GroupsIcon, title: 'Teams'},
    {Icon: DashboardIcon, title: 'Dashboard'},
]


export const RouteSelect = () => {
  return (
    <div className='w-full'>
        <div className='py-4 border-b border-border'>
        {routes.map((route, index) => (
            <NavRoutes key={index} {...route} />
        ))}
        </div>
        <div className='w-full mt-4 flex justify-center items-center'>
            <NavLink to={`/hud`} target='_blank' className={({ isActive }) => 
        `flex items-center justify-center gap-4 w-3/4 p-2 transition-[box-shadow,_background-color,_color] rounded hover:bg-border bg-secondary-dark text-stone-300 shadow-none`
        }>
                <PlayArrowIcon />
                Hud
            </NavLink>
        </div>
    </div>
  )
}


const NavRoutes = ({Icon, title, target}: RouteProps) => {

    return (
        <NavLink 
        to={`${title.toLowerCase()}`}
        target={target}
        className={({ isActive }) => 
        `flex items-center justify-start gap-4 w-full py-3 px-6 transition-[box-shadow,_background-color,_color] 
        ${isActive ? 'bg-primary text-textcolor shadow' : 'hover:bg-border bg-transparent text-stone-300 shadow-none'}`
        }>
            {<Icon />}
            {title}
      </NavLink>
    )
}