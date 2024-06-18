import { withLayout } from '@/layout/Layout';
import { UsersAdminPage } from '@/page-component/AdminPages/Users/Users';

const AdminUsers = () => {
	return <UsersAdminPage />;
};

export default withLayout(AdminUsers, 'admin');
