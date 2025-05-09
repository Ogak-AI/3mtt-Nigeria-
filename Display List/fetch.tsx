import React, { useState, useEffect } from 'react';

// Reusable List Component
const ListComponent = ({ 
  items, 
  isLoading, 
  error, 
  renderItem, 
  emptyMessage = "No items found" 
}) => {
  if (isLoading) {
    return <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Error: {error}</p>
    </div>;
  }

  if (!items || items.length === 0) {
    return <div className="text-gray-500 p-4 text-center">{emptyMessage}</div>;
  }

  return (
    <ul className="divide-y divide-gray-200 shadow-sm rounded-lg border border-gray-200">
      {items.map((item, index) => (
        <li key={item.id || index} className="p-4 hover:bg-gray-50">
          {renderItem ? renderItem(item) : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
};

// Parent component that fetches data
const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState('users');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/${apiSource}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiSource]);

  // Custom render functions for different API endpoints
  const renderUser = (user) => (
    <div className="flex items-center space-x-3">
      <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center text-blue-500 font-semibold">
        {user.name.charAt(0)}
      </div>
      <div>
        <h3 className="font-medium">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );

  const renderPost = (post) => (
    <div>
      <h3 className="font-medium">{post.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{post.body.substring(0, 100)}...</p>
    </div>
  );

  const renderTodo = (todo) => (
    <div className="flex items-center">
      <input 
        type="checkbox" 
        checked={todo.completed} 
        readOnly 
        className="h-4 w-4 text-blue-600 mr-3" 
      />
      <span className={todo.completed ? "line-through text-gray-400" : ""}>{todo.title}</span>
    </div>
  );

  // Select the appropriate render function based on API source
  const getRenderFunction = () => {
    switch (apiSource) {
      case 'users':
        return renderUser;
      case 'posts':
        return renderPost;
      case 'todos':
        return renderTodo;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">API Data Viewer</h1>
      
      <div className="mb-6 flex justify-center space-x-4">
        <button 
          onClick={() => setApiSource('users')}
          className={`px-4 py-2 rounded ${apiSource === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
        <button 
          onClick={() => setApiSource('posts')}
          className={`px-4 py-2 rounded ${apiSource === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Posts
        </button>
        <button 
          onClick={() => setApiSource('todos')}
          className={`px-4 py-2 rounded ${apiSource === 'todos' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Todos
        </button>
      </div>

      <ListComponent 
        items={data}
        isLoading={isLoading}
        error={error}
        renderItem={getRenderFunction()}
        emptyMessage={`No ${apiSource} found`}
      />
    </div>
  );
};

export default App;
