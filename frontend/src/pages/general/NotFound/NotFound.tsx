import { useTranslation } from "react-i18next";
import './NotFound.css'
import CommentSection from "../../../components/comment-section/CommentSection";
import CommentDisplay from "../../../components/comment-section/CommentDisplay";
import { useState } from "react";

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    const [commentData, setCommentData] = useState<{
        name: string;
        surname?: string;
        rating: number;
        content: string;
        images: string[];
        createdAt?: string;
    } | null>(null);

    return (
        <div className="bg-black w-screen h-screen  flex flex-col items-center justify-center p-2">
            <h1 className="text-white text-9xl">404</h1>
            <p className="text-white">{t('404_not_found')}</p>
            <CommentSection onSubmit={(data) => setCommentData({
                ...data,
                createdAt: new Date().toISOString() // Add current timestamp here!
            })} />

            {commentData && (
                <CommentDisplay
                    name={commentData.name}
                    surname={commentData.surname}
                    rating={commentData.rating}
                    content={commentData.content}
                    images={commentData.images}
                    createdAt={commentData.createdAt} // Optional if you want show time
                />
            )}

        </div>
    );
};

export default NotFound;