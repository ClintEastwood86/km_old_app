import { withLayout } from '@/layout/Layout';
import { CommentsAdminPage } from '@/page-component/AdminPages/Comments/Comments';

const AdminComments = () => {
	return <CommentsAdminPage />;
};

export default withLayout(AdminComments, 'admin');
