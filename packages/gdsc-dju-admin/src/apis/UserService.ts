import axios from 'axios';
import { RowUserData } from 'types/userDataType';

import { Api } from './index';

class UserService extends Api {
  getMyData = (token: string) => {
    return axios.get<RowUserData>(
      `${this.ACCOUNT_API}/member-route/api/guest/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };
}
export default new UserService();
