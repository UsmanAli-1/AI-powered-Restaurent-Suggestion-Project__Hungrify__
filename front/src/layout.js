import { Outlet } from 'react-router-dom';
import Header from './header';

export default function layout() {
    return (
        <main>
            <Header />
                          {/* use outlet to put content between  */}
            <Outlet />
        </main>
    );
}