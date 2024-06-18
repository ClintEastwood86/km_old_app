import { withLayout } from '@/layout/Layout';
import { AwardsAdminPage } from '@/page-component/AdminPages/Awards/Awards';

const AdminAwards = () => {
	return <AwardsAdminPage />;
};

export default withLayout(AdminAwards, 'admin');
