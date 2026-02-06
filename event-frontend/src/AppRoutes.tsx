import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { User } from "./utils/types";
import EventHomePage from "./Pages/homePage.tsx";
import EventDetailPage from "./Pages/events/detailPage.tsx";
import LogsignPage from "./Pages/logsign/logsignPage.tsx";
import ProfilePage from "./Pages/profilePage.tsx";

type AppRoutesProps = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export default function AppRoutes({ user, setUser }: AppRoutesProps) {
    const token = localStorage.getItem("token");
    const isAuthenticated = useMemo(() => Boolean(token && user), [token, user]);

    return (
        <Routes>
            <Route
                path="/"
                element={<EventHomePage user={user} />}
            />

            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/" replace />
                    ) : (
                        <LogsignPage setUser={setUser} />
                    )
                }
            />

            <Route
                path="/signup"
                element={
                    isAuthenticated ? (
                        <Navigate to="/" replace />
                    ) : (
                        <LogsignPage setUser={setUser} />
                    )
                }
            />

            <Route path="/event/:id" element={<EventDetailPage />} />

            <Route
                path="/profile"
                element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}