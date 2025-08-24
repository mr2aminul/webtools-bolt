'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Gift } from 'lucide-react';

interface RewardedVideoAdProps {
  onRewardEarned: () => void;
  rewardDescription: string;
  trigger?: React.ReactNode;
}

export function RewardedVideoAd({ onRewardEarned, rewardDescription, trigger }: RewardedVideoAdProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleWatchAd = async () => {
    setIsLoading(true);
    setIsPlaying(true);

    // Simulate video ad playback
    // In production, this would integrate with GAM rewarded video
    setTimeout(() => {
      setIsPlaying(false);
      setIsLoading(false);
      setIsOpen(false);
      onRewardEarned();
    }, 3000);
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
        >
          <Gift className="h-4 w-4 mr-2" />
          Watch Ad for Reward
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <span>Earn Reward</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{rewardDescription}</p>
              
              {!isPlaying ? (
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <Play className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">Video advertisement will play here</p>
                </div>
              ) : (
                <div className="bg-black rounded-lg p-8 mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <div className="h-32 flex items-center justify-center text-white">
                    Playing Advertisement...
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPlaying}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWatchAd}
                disabled={isLoading || isPlaying}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {isLoading ? 'Loading...' : 'Watch Ad'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}