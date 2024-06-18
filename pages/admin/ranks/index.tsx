import { withLayout } from '@/layout/Layout';
import { RanksAdminPage } from '@/page-component/AdminPages/Ranks/Ranks';

const AdminRanks = () => {
	return <RanksAdminPage />;
};

export default withLayout(AdminRanks, 'admin');
