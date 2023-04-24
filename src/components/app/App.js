import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Spinner from '../spinner/Spinner';

import AppHeader from '../appHeader/AppHeader';

const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicsPage = lazy(() => import('../pages/SingleComicsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const App = () => {
    return (
        <Router>
            <div className="app">
                <Suspense fallback={<Spinner />}>
                    <AppHeader />
                    <main>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="comics" element={<ComicsPage />} />
                            <Route
                                path="comics/:comicsId"
                                element={<SingleComicsPage />}
                            />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                </Suspense>
            </div>
        </Router>
    );
};

export default App;
