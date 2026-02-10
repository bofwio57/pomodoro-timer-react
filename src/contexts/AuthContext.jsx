import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 현재 로그인된 유저
    const [isLoading, setIsLoading] = useState(true); // 로그인 처리 중 여부

    // 초기 접근, 로컬스토리지에서 유저 복원
    useEffect(() => {
        const savedUser = localStorage.getItem("zen_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // 로그인
    const login = async (email) => {
        setIsLoading(true);

        setTimeout(() => {
            const newUser = { id: "user_" + Date.now(), email, name: email.split("@")[0] };
            setUser(newUser);
            localStorage.setItem("zen_user", JSON.stringify(newUser));
            setIsLoading(false);
        }, 800);
    };

    // 로그아웃
    const logout = () => {
        setUser(null);
        localStorage.removeItem("zen_user");
    };

    //children  안에 있는 모든 컴포넌트가 user에 접근 가능
    return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
