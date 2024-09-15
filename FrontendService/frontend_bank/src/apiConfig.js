// const URL_ID = "localhost";
// const URL_ID = "192.168.4.170";
const URL_ID = "192.168.29.30";

const API_BASE_URL_8080 = `http://${URL_ID}:8080`;
const API_BASE_URL_8090 = `http://${URL_ID}:8090`;
const API_BASE_URL_8100 = `http://${URL_ID}:8100`;

const apiConfig = {
  baseURL: {
    port8080: API_BASE_URL_8080,
    port8090: API_BASE_URL_8090,
    port8100: API_BASE_URL_8100,
  },
  endpoints: {
    // Endpoints for port 8080
    accountGenerationByAdmin_8080: `${API_BASE_URL_8080}/api/v1/admin/register-bank-account`,
    userBankAccountNumber_Name_8080: `${API_BASE_URL_8080}/api/v1/user/account`,
    allAccountDetailsFetchByAdmin_8080: `${API_BASE_URL_8080}/api/v1/admin/bank-accounts`,
    userEmailCheckForAccountLogin_8080: `${API_BASE_URL_8080}/api/v1/auth/check-email`,
    userEmailCheckForAccountPortalRegistration_8080: `${API_BASE_URL_8080}/api/v1/auth/check-email`,
    userCheckForUnregisteredPortalEmail_8080: `${API_BASE_URL_8080}/api/v1/public/unregistered-portal-email`,
    userSignInRequest_8080: `${API_BASE_URL_8080}/api/v1/auth/signin`,
    userSignUpRequest_8080: `${API_BASE_URL_8080}/api/v1/auth/signup`,
    // Endpoints for port 8080
    sendOtpRequest_8090: `${API_BASE_URL_8090}/api/otp/send`,
    verifyOtpRequest_8090: `${API_BASE_URL_8090}/api/otp/verify`,
    // Endpoints for port 8100
    newCrediTransaction_8100: `${API_BASE_URL_8100}/api/transactions/new`,
    newDebitTransaction_8100: `${API_BASE_URL_8100}/api/transactions/new`,
    accountBalanceEnquary_8100: `${API_BASE_URL_8100}/api/accounts/`,
    userTransactionDetails_8100: `${API_BASE_URL_8100}/api/transactions/byAccountNumber/`,
    bankAccountSubmissionForTransaction_8100: `${API_BASE_URL_8100}/api/accounts/register`,
  },
};

export default apiConfig;
