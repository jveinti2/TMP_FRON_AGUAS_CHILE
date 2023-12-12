import { useContext } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { LoginContext } from '../context/Login';
import { loginApi } from '../services/auth.services';
import toast, { Toaster } from 'react-hot-toast';

export default function SingIn() {
	const { setUser } = useContext(LoginContext);
	const userLogin = {
		email: '',
		password: '',
	};

	const handleSubmit = () => {
		loginApi(userLogin)
			.then(res => {
				if (res.response === 200) {
					localStorage.setItem('userToken', res.data.token);
					localStorage.setItem('user', JSON.stringify(res.data));
					setUser(res.data);
					toast.success('Bienvenido');
					window.location.reload();
				}
			})
			.catch(err => {
				console.log(err);
				toast.error('Usuario o contraseña incorrecta');
			});
	};

	return (
		<div className='bg-[#171e29] grid place-content-center md:grid-cols-2 h-screen'>
			<Toaster />
			<div className='grid place-content-center '>
				<div>
					<img
						className='h-28 md:h-48 rounded-3xl object-cover'
						src='/aguas_chile.PNG'
						alt='logo'
					/>
					<h1 className='text-white text-4xl font-bold mt-4 text-center'>
						Bienvenido
					</h1>
				</div>
			</div>
			<div className='grid place-content-center '>
				<Card className='w-72 md:w-80'>
					<form className='flex flex-col gap-4'>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='email' value='Correo' />
							</div>
							<TextInput
								id='email'
								placeholder='email@gmail.com'
								type='email'
								onChange={e => {
									userLogin.email = e.target.value;
								}}
							/>
						</div>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='password' value='Contraseña' />
							</div>
							<TextInput
								placeholder='********'
								id='password'
								type='password'
								onChange={e => {
									userLogin.password = e.target.value;
								}}
							/>
						</div>

						<Button onClick={handleSubmit}>Iniciar sesión</Button>
					</form>
				</Card>
			</div>
		</div>
	);
}
