import { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
	const [user, setUser] = useState({
		email: '',
		password: '',
	});
	return (
		<LoginContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</LoginContext.Provider>
	);
};
