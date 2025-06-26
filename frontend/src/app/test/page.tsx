"use client";
import { useAuth } from "@/src/context/AuthContext";

const Header = () => {
    const { authenticated, role, user, isAdmin, isSeller, isBuyer, refetch } = useAuth();

    return (
        <header>
            {authenticated ? (
                <>
                    <p>Welcome, {user?.name || user?.email}</p>
                    {isSeller && <p>You are logged in as Seller</p>}
                    {isAdmin && <p>Admin Panel</p>}
                    {isBuyer && <p>You are logged in as Buyer</p>}
                </>
            ) : (
                <>
                    <p>Please login</p>
                    <button >
                        Refresh
                        <span onClick={refetch}>🔄</span>
                    </button>
                </>
            )}
        </header>
    );
};

export default Header;