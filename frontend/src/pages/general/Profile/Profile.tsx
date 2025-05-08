import React, { useEffect, useState } from "react";

import { BasicUserInfo, getUser } from "../../../endpoints/user";
import { useParams } from "react-router-dom";
import EmptyProfilePicture from "../../../components/user/EmptyProfilePicture";

interface Params {
    userId?: string | number | null;
}

const Profile: React.FC<Params> = () => {

    const { userId } = useParams<{ userId: string }>();

    const [user, setUser] = useState<BasicUserInfo | null>(null);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let id: number | 'me' | null = null;
                if (userId === 'me') {
                    id = 'me';
                } else if (userId != null) {
                    id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
                }
                if (id !== null) {
                    const data = await getUser({ userId: id });
                    setUser(data);
                } else {
                    setError("Invalid user ID.");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [])

    return (
        <div className="w-screen max-w-screen min-h-screen p-5 bg-black flex flex-col items-center">
            <div className="w-[95%] lg:w-[55%] max-w-[95%] min-h-screen flex flex-col items-center align-middle text-white mt-20">
                <EmptyProfilePicture username='user' />
                <div className="flex flex-col items-center mt-2">
                    <h1 className="text-2xl font-bold">Username</h1>
                    <p className="text-gray-400 text-sm">email</p>
                </div>
            </div>
        </div>
    )
}

export default Profile;