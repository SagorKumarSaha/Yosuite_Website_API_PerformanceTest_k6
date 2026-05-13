import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

// Types

type LoginResponse = {
  data: {
    token: string;
  };
  message: string;
};

type AwardResponse = {
  message: {
    success: string;
  };
};

type AnnouncementResponse = {
  message: {
    success: string;
  };
};

type EmployeeResponse = {
  message: {
    success: string;
  };
};

export default function () {

  // 1. LOGIN REQUEST

  const loginUrl = 'https://api-user-account.yosuite.net/api/auth';

  const loginPayload = JSON.stringify({
    email: 'wawoyep961@besenica.com',
    password: 'HUG5dkQIJq@',
  });

  const loginHeaders = {
    'Content-Type': 'application/json',
    "Origin": "https://microsoft.yosuite.net",
  };

  const loginRes = http.post(loginUrl, loginPayload, {
    headers: loginHeaders,
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });

  console.log('Login Response Status:', loginRes.status);
  console.log('Login Response Body:', loginRes.body);

  const loginJson = loginRes.json() as LoginResponse;
  const token = loginJson?.data?.token;

  check(token, {
    'token extracted successfully': (t) => t !== undefined,
  });

  // 1. CREATE EMPLOYEE
  // =========================
  const empRandom = Math.floor(10000 + Math.random() * 90000);
  const email = `rony${empRandom}@gmail.com`;
  const staffId = `EMP${empRandom}`;

  const employeeHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const employeeRes = http.post(
    'https://api-backend.yosuite.net/component/modules/people/employee/e-onboarding-steps/form-component/store-content',
    {
      data: JSON.stringify({
        first_name: 'Sagor',
        last_name: 'Saha',
        email: email,
        middle_name: null,
        phone: '',
        staff_id: staffId,
        social_security_no: '123456789',
        date_of_birth: null,
        joining_date: '2026-04-05',
        hire_date: null,
        address_group: {
          present_address: {
            street_1: '1600 Pennsylvania Avenue NW',
            street_2: null,
            country: 'Bangladesh',
            state: 'Khulna',
            city: 'Magura',
            zip: '20500',
          },
          permanent_address: {
            same_as_present_address: true,
            street_1: '1600 Pennsylvania Avenue NW',
            street_2: null,
            country: 'Bangladesh',
            state: 'Khulna',
            city: 'Magura',
            zip: '20500',
          },
        },
        employee_department_option_id: '69cde7833054cdbe81049520',
        employee_job_location_option_id: '693916856b0cc0a1d5068613',
        employee_job_type_option_id: '692fdff8397c6c094bfb44a9',
        employee_job_title_option_id: '69d7f2bc8ec8caffbb0d81e2',
        employee_status_option_id: '697b383429e1363495061cb6',
        employee_gender_option_id: null,
        shift_option_id: '692fe275f348e6963301e216',
        work_function: null,
        manager_id: null,
        who_to_contact_id: null,
        present_address: null,
        permanent_address: null,
        employer_tasks: null,
        joiner_tasks: null,
        joiner_questions: {
          "697b3ceef1f074b159047766": {
            "0": true,
          },
          "695ddd1ce35026b82201d8b3": null,
        },
      }),
    },
    { headers: employeeHeaders }
  );

  const employeeJson = employeeRes.json() as EmployeeResponse;

  check(employeeRes, {
    'Employee status 200': (r) => r.status === 200,
    'Employee created successfully': () =>
      employeeJson?.message?.success?.includes('Employee Added Successfully!'),
  });


  // 2. CREATE AWARD REQUEST

  const awardUrl =
    'https://api-backend.yosuite.net/component/modules/appreciations/award/form/form-component/store-content';

  const random = Math.floor(100000 + Math.random() * 90000);
  const awardName = `Monthly Best Employee - ${random}`;

  const payload = {
    data: JSON.stringify({
      name: awardName,
      note: 'Monthly best performer',
      award_item: [
        {
          temp: 'Award Item',
          currency: 'USD',
          gift_name: 'USD',
          price: 100,
        },
      ],
    }),
  };

  const awardHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const awardRes = http.post(awardUrl, payload, {
    headers: awardHeaders,
  });

  const awardJson = awardRes.json() as AwardResponse;

  check(awardRes, {
    'award status is 200': (r) => r.status === 200,
    'award created successfully': () =>
      awardJson?.message?.success?.includes('Data Inserted Successfully'),
  });

  // 3. CREATE ANNOUNCEMENT

  const announceRandom = Math.floor(100000 + Math.random() * 90000);
  const announceTitle = `Monthly Best Employee - ${announceRandom}`;

  const announcementRes = http.post(
    'https://api-backend.yosuite.net/component/modules/announcements/announcement/form/form-component/store-content',
    {
      data: JSON.stringify({
        title: announceTitle,
        content:
          '<p class="PlaygroundEditorTheme__paragraph" dir="ltr"><span style="white-space: pre-wrap;">Best Performer</span></p>',
        attachments: null,
        applicable_scope: 'all',
        exclude_with: null,
        is_event: false,
        pinned: true,
        enable_comments: true,
        color: null,
        category: 'important',
      }),
    },
    { headers: awardHeaders }
  );

  const announceJson = announcementRes.json() as AnnouncementResponse;

  check(announcementRes, {
    'Announcement status 200': (r) => r.status === 200,
    'Announcement created successfully': () =>
      announceJson?.message?.success?.includes('Data Inserted Successfully'),
  });
}