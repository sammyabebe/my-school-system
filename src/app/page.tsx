export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">School Management System</h1>
        <p className="text-lg">
          <a href="/admins/login" className="text-blue-600 hover:underline">Admin Login</a> | 
          <a href="/students/login" className="text-blue-600 hover:underline">Student Login</a>
        </p>
      </div>
    </div>
  );
}