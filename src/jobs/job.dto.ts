export interface JobDto {
  employerId: String | undefined;

  companyName: String | undefined;

  title: String | undefined;

  skill: String | undefined;

  location: String | undefined;

  keyword: [String] | undefined;

  description: String | undefined;

  address?: String | undefined;

  jobType: String | undefined;

  workType: String | undefined;

  isAvailable: Boolean;

  salary: String | undefined;

  yearOfExperience: String | undefined;
}
