type NavItem = {
    id: number;
    name: string,
    href: string,
    icon: string
}

export const navItems: NavItem[] = [
    { 
        id: 0,
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'Dashboard'
    },
    {
        id: 1,
        name: 'Tasks',
        href: '/tasks',
        icon: 'check'
    },
    {
        id: 2,
        name: 'Calendar',
        href: '/calendar',
        icon: 'calendar'
    }
]