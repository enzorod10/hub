'use client';

import { User } from "@/app/types";

export const Settings = ({ user }: { user: User }) => {
    return(
        <div className="w-full text-primary-foreground">
            <h3 className="text-md font-medium mb-2">Interests</h3>
            <ul className="list-disc pl-5">
                {user.interests.map((interest, index) => (
                    <li key={index} className="text-sm">{interest}</li>
                ))}
            </ul>
        </div>
    );
}
