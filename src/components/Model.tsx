import { FC, useState } from 'react';
import { X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  properties: string
}

interface ModelProps {
  isOpen: boolean;
  onClose: () => void;
  usersDetails: User[];
  // users: User[];
}

const Model: FC<ModelProps> = ({ isOpen, onClose, usersDetails }) => {
  console.log(usersDetails);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = usersDetails.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-red-500 hover:text-red-700"
        >
          < X size={20} />
        </button>
        <input
          type="text"
          placeholder="Search by UserName, City and State"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="border-b pb-2">
                <p className="font-semibold">{user.firstName}</p>
                <p className="text-sm text-gray-500">{user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;
