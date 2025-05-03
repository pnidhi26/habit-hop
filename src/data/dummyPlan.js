const dummyPlan = {
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
        dates: ["2025-04-28", "2025-04-30"],  // Previous week dates
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
        dates: ["2025-05-08", "2025-05-10"],  // Next week dates
        times: [60, 60],
        timeOfDay: ["Morning", "Morning"],
        status: [false, false]
      }
    ]
}

export default dummyPlan;