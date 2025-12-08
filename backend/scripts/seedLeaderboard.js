import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import connectDB, { getDB, closeDB } from "../config/db.js";

// Load environment variables
dotenv.config({ path: ".env" });

/**
 * Seed script to populate test data for leaderboard
 * Creates problem solvers with statistics and tasks
 * Run: node backend/scripts/seedLeaderboard.js
 */

const seedLeaderboardData = async () => {
  try {
    // Initialize database connection
    await connectDB();
    const db = getDB();
    const usersCollection = db.collection("users");
    const statisticsCollection = db.collection("statistics");
    const tasksCollection = db.collection("tasks");

    console.log("🌱 Starting leaderboard seed...");

    // Clear existing test data
    await usersCollection.deleteMany({
      email: { $regex: /^solver_test_/ }
    });
    await statisticsCollection.deleteMany({
      userId: { $regex: /test/ }
    });
    await tasksCollection.deleteMany({
      solverEmail: { $regex: /^solver_test_/ }
    });

    // Create problem solver users
    const problemSolvers = [];
    const solverNames = [
      "আহমেদ করিম",
      "ফাতিমা আক্তার",
      "রহিম সাহেব",
      "নাজমা বেগম",
      "করিম হোসেন",
      "সালমা খাতুন",
      "ইব্রাহিম মিয়া",
      "রুমানা আফরোজ",
      "হাসান আলী",
      "জয়িতা দাস"
    ];

    const districts = [
      "ঢাকা",
      "চট্টগ্রাম",
      "সিলেট",
      "খুলনা",
      "বরিশাল",
      "রাজশাহী",
      "রংপুর",
      "ময়মনসিংহ",
      "গাজীপুর",
      "নারায়ণগঞ্জ"
    ];

    // Create 10 problem solvers
    for (let i = 0; i < solverNames.length; i++) {
      const solverId = new ObjectId();
      problemSolvers.push({
        _id: solverId,
        name: solverNames[i],
        email: `solver_test_${i}@example.com`,
        phone: `01700${String(i).padStart(6, "0")}`,
        role: "problem_solver",
        status: "active",
        district: districts[i],
        division: "Dhaka", // For simplicity
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insert problem solvers
    const insertedSolvers = await usersCollection.insertMany(problemSolvers);
    const solversCount = Object.keys(insertedSolvers.insertedIds).length;
    console.log(`✅ Created ${solversCount} problem solvers`);

    // Create statistics for each solver
    const statistics = [];
    for (let i = 0; i < problemSolvers.length; i++) {
      const points = Math.floor(Math.random() * 5000) + 500; // 500-5500 points
      const completedTasks = Math.floor(Math.random() * 50) + 5; // 5-55 tasks
      const level = Math.floor(points / 1000) + 1;
      const xp = points % 1000;
      const streak = Math.floor(Math.random() * 30) + 1; // 1-30 days
      const totalRating = (Math.random() * 2 + 3.5).toFixed(1); // 3.5-5.5 rating

      statistics.push({
        userId: problemSolvers[i]._id,
        points: points,
        completedTasks: completedTasks,
        ongoingTasks: Math.floor(Math.random() * 10) + 1,
        totalTasks: completedTasks + Math.floor(Math.random() * 8),
        level: level,
        xp: xp,
        xpRequired: 1000,
        streak: streak,
        totalRating: parseFloat(totalRating),
        badges: Math.random() > 0.5 ? ["⭐ Star Solver", "🏆 Top Performer"] : ["⭐ Star Solver"],
        lastUpdated: new Date()
      });
    }

    // Insert statistics
    const insertedStats = await statisticsCollection.insertMany(statistics);
    const statsCount = Object.keys(insertedStats.insertedIds).length;
    console.log(`✅ Created ${statsCount} statistics records`);

    // Create sample tasks
    const tasks = [];
    for (let i = 0; i < problemSolvers.length; i++) {
      for (let j = 0; j < 3; j++) {
        tasks.push({
          title: `Road Repair Task ${i}-${j}`,
          description: `This is a sample task for testing`,
          location: {
            district: districts[i],
            division: "Dhaka",
            latitude: 23.8103 + Math.random() * 0.5,
            longitude: 90.4125 + Math.random() * 0.5,
            address: `Sample Address ${i}-${j}`
          },
          priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
          status: j === 0 ? "completed" : "ongoing",
          solver: problemSolvers[i]._id,
          solverEmail: `solver_test_${i}@example.com`,
          reward: Math.floor(Math.random() * 5000) + 1000,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          completedAt: j === 0 ? new Date() : null,
          updatedAt: new Date()
        });
      }
    }

    // Insert tasks
    const insertedTasks = await tasksCollection.insertMany(tasks);
    const tasksCount = Object.keys(insertedTasks.insertedIds).length;
    console.log(`✅ Created ${tasksCount} sample tasks`);

    console.log("✨ Leaderboard seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Problem Solvers: ${solversCount}`);
    console.log(`   - Statistics Records: ${statsCount}`);
    console.log(`   - Sample Tasks: ${tasksCount}`);
    console.log(
      "\n🎯 You can now visit /api/leaderboard to see the leaderboard data!"
    );

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

// Run seed
seedLeaderboardData();
