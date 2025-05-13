import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { BasicUserInfo, getLastViewed, getUser } from "../../../endpoints/user";
import { useParams } from "react-router-dom";
import EmptyProfilePicture from "../../../components/user/EmptyProfilePicture";
import { logout } from "../../../endpoints/auth";

import { useAuth } from "../../../contexts/authContext";
import LastViewed from "../../../components/user/LastViewed";
import TfaModal from "../../../components/profile/tfaModal";

interface Params {
    userId?: string | number | null;
}

const Profile: React.FC<Params> = () => {

    const { userId } = useParams<{ userId: string }>();

    const navigate = useNavigate();

    const { setUser: makeUser, user: cUser } = useAuth();

    const { t } = useTranslation();

    const [user, setUser] = useState<BasicUserInfo | null>(null);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    const [tfaOpen, setTfOpen] = useState<boolean>(false);
    const [lastViewed, setLastViewed] = useState<any>(null)

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

    console.log(lastViewed)

    useEffect(() => {
        if (userId === 'me') {
            getLastViewed().then((data) => setLastViewed(data)).catch((err) => console.error(err))
        }
    }, [])

    const handleLogout = async () => {
        try {
            logout()
            navigate('/catalog')
            makeUser(null)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="w-[100%] max-w-[100%] min-h-screen p-5 bg-[#0D1B2A] flex flex-col items-center overflow-x-hidden">
            <div className="w-[95%] lg:w-[55%] max-w-[95%] min-h-screen flex flex-col items-center align-middle text-white mt-20 overflow-x-hidden">
                <EmptyProfilePicture username={user?.username} />
                <div className="flex flex-col items-center mt-2 mb-4 overflow-x-hidden">
                    <h1 className="text-2xl font-bold">{user?.username}</h1>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>

                {tfaOpen && <TfaModal onClose={() => setTfOpen(false)} />}

                <div className="flex flex-col w-full items-center mt-4 gap-1 overflow-x-hidden">
                    <button
                        onClick={() => setTfOpen(!tfaOpen)}
                        className="px-6 py-2 cursor-pointer rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 shadow-sm min-w-[95%] max-w-[95%]"
                    >
                        {t('profile.setup_2fa')}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 cursor-pointer rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200 shadow-sm min-w-[95%] max-w-[95%]"
                    >
                        {t('profile.logout')}
                    </button>
                </div>

                {cUser && lastViewed && <LastViewed products={lastViewed} />}

            </div>
        </div>
    )
}

export default Profile;