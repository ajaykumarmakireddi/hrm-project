import { Route, Routes, useNavigate } from 'react-router-dom';
import ApplyLeaveForm from './ApplyLeaveForm';
import LeaveManagementHeader from './LeaveManagementHeader';
import { lazy, Suspense } from 'react';
import SquareTableSkeleton from '@/SkeletonLoaders/SquareTableSkeleton';
import LeaveManagementHomePage from './LeaveManagementHomePage';

const PendingsTable = lazy(() => import('./PendingsTable'))
const ApprovalsTable = lazy(() => import('./ApprovalsTable'))

const LeaveManagementRoute = () => {

    const navigate = useNavigate();

    return (


        <Routes>
            {/* <Route  index element={<LeaveManagement/>}/> */}
            <Route index element={<LeaveManagementHomePage navigate={navigate} />} />

            <Route path='/apply' element={<ApplyLeaveForm navigate={navigate} />} />
            <Route path='/pendings' element={
                <Suspense fallback={<SquareTableSkeleton />}>
                    <PendingsTable navigate={navigate} />
                </Suspense>
            } />
            <Route path='/approvals' element={
                <Suspense fallback={<SquareTableSkeleton />}>
                    <ApprovalsTable navigate={navigate} />
                </Suspense>
            } />
        </Routes>

    );
};

export default LeaveManagementRoute;