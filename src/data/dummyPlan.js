const dummyPlans = [
  {
    planName: "Sports",
    activities: [
      {
        activityId: 1001,
        habit: {
          habitId: "3f81ff9e-59d3-4018-8e3e-0ff2dd68897f",
          habitName: "Running",
          habitDescription: "Morning jog in the park",
          habitImage: "running.png"
        },
        dates: ["2025-05-01", "2025-05-03"],
        times: [30, 45],
        timeOfDay: ["Morning", "Afternoon"],
        status: [true, false]
      },
      {
        activityId: 1002,
        habit: {
          habitId: "a230f702-ee1c-4754-bd25-49582f08e1e9",
          habitName: "Yoga",
          habitDescription: "Evening yoga session",
          habitImage: "yoga.png"
        },
        dates: ["2025-05-02"],
        times: [60],
        timeOfDay: ["Evening"],
        status: [false]
      },
      {
        activityId: 1003,
        habit: {
          habitId: "b342ef54-9d12-3789-ab25-76590f23e8a1",
          habitName: "Gym Workout",
          habitDescription: "Strength training",
          habitImage: "gym.png"
        },
        dates: ["2025-04-28", "2025-04-30"],
        times: [90, 45],
        timeOfDay: ["Morning", "Afternoon"],
        status: [true, true]
      },
      {
        activityId: 1004,
        habit: {
          habitId: "c453fe65-8e23-4678-bc36-87671e34f9b2",
          habitName: "Swimming",
          habitDescription: "Lap swimming at the pool",
          habitImage: "swimming.png"
        },
        dates: ["2025-05-08", "2025-05-10"],
        times: [60, 60],
        timeOfDay: ["Morning", "Morning"],
        status: [false, false]
      },
      {
        activityId: 1005,
        habit: {
          habitId: "c453fe65-8e23-4678-bc36-87671e34f9b3",
          habitName: "Swimming",
          habitDescription: "Lap swimming at the pool",
          habitImage: "swimming.png"
        },
        dates: ["2025-05-03", "2025-05-03"],
        times: [60, 60],
        timeOfDay: ["Morning", "Afternoon"],
        status: [false, false]
      }
    ]
  },
  {
    planName: "Study",
    activities: [
      {
        activityId: 2001,
        habit: {
          habitId: "study-001",
          habitName: "Read Algorithms Book",
          habitDescription: "Study Chapter 3: Sorting Algorithms",
          habitImage: "algorithms.png"
        },
        dates: ["2025-05-03"],
        times: [45],
        timeOfDay: ["Morning"],
        status: [false]
      },
      {
        activityId: 2002,
        habit: {
          habitId: "study-002",
          habitName: "Take Math Notes",
          habitDescription: "Review linear algebra notes",
          habitImage: "math.png"
        },
        dates: ["2025-05-03"],
        times: [60],
        timeOfDay: ["Evening"],
        status: [false]
      },
      {
        activityId: 2003,
        habit: {
          habitId: "study-003",
          habitName: "Watch Lecture Video",
          habitDescription: "CS101 recorded lecture on recursion",
          habitImage: "video.png"
        },
        dates: ["2025-05-04"],
        times: [40],
        timeOfDay: ["Afternoon"],
        status: [false]
      },
      {
        activityId: 2004,
        habit: {
          habitId: "study-004",
          habitName: "Write Essay Draft",
          habitDescription: "Finish 500 words of research paper",
          habitImage: "writing.png"
        },
        dates: ["2025-05-05"],
        times: [90],
        timeOfDay: ["Morning"],
        status: [false]
      },
      {
        activityId: 2005,
        habit: {
          habitId: "study-005",
          habitName: "Practice Coding",
          habitDescription: "Solve 3 LeetCode problems",
          habitImage: "coding.png"
        },
        dates: ["2025-05-05"],
        times: [60],
        timeOfDay: ["Evening"],
        status: [false]
      }
    ]
  }
];

export default dummyPlans;
