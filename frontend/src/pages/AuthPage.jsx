import { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';


export default function AuthPage() {
  const [view, setView] = useState('signup'); // 'signup' | 'signin'

  return view === 'signup'
    ? <SignUp onNavigateToSignIn={() => setView("signin")}/>
    : <SignIn onNavigateToSignUp={() => setView("signup")}/>;
}