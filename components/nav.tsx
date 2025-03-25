import { navItems } from "@/constants/nav"
import React from "react"

function Nav(){
    return (
        <div className="flex flex-col">
            {navItems.map((item) => {
                return (
                    <div key={item.id} className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        <div className={`iconify text-2xl`} data-icon={item.icon}>Icon </div>
                        <div className="text-lg font-medium">{item.name}</div>
                    </div>
                )})}
        </div>

    )
}

export default Nav;