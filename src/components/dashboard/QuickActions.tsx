
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Link to="/chat">
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chatear con Mushu
        </Button>
      </Link>
      <Link to="/wellbeing">
        <Button variant="outline">
          <Heart className="mr-2 h-4 w-4" />
          Momento de Bienestar
        </Button>
      </Link>
    </div>
  );
};

export default QuickActions;
