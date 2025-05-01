import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  Tabs, 
  Tab, 
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('weekly');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate fetch delay
    setTimeout(() => {
      const mockData = [
        { 
          id: 1, 
          name: 'Prakash Nidhi Verma', 
          points: 1250, 
          completedHabits: 38, 
          streak: 14,
          avatar: 'https://i.pravatar.cc/150?img=1',
          isCurrentUser: false
        },
        { 
          id: 2, 
          name: 'Dentai', 
          points: 980, 
          completedHabits: 31, 
          streak: 8,
          avatar: 'https://i.pravatar.cc/150?img=2',
          isCurrentUser: true  // This would be determined dynamically
        },
        { 
          id: 3, 
          name: 'Boxi', 
          points: 890, 
          completedHabits: 26, 
          streak: 6,
          avatar: 'https://i.pravatar.cc/150?img=3',
          isCurrentUser: false
        },
        { 
          id: 4, 
          name: 'Austin', 
          points: 780, 
          completedHabits: 22, 
          streak: 7,
          avatar: 'https://i.pravatar.cc/150?img=4',
          isCurrentUser: false
        },
        { 
          id: 5, 
          name: 'Aditi', 
          points: 730, 
          completedHabits: 19, 
          streak: 4,
          avatar: 'https://i.pravatar.cc/150?img=5',
          isCurrentUser: false
        },
        { 
          id: 6, 
          name: 'James Wilson', 
          points: 680, 
          completedHabits: 15, 
          streak: 3,
          avatar: 'https://i.pravatar.cc/150?img=6',
          isCurrentUser: false
        },
        { 
          id: 7, 
          name: 'Alex Parker', 
          points: 650, 
          completedHabits: 14, 
          streak: 5,
          avatar: 'https://i.pravatar.cc/150?img=7',
          isCurrentUser: false
        },
        { 
          id: 8, 
          name: 'Olivia Martinez', 
          points: 610, 
          completedHabits: 12, 
          streak: 2,
          avatar: 'https://i.pravatar.cc/150?img=8',
          isCurrentUser: false
        }
      ];

      // Sort by points descending
      mockData.sort((a, b) => b.points - a.points);
      
      setLeaderboardData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeFrame]); // Reload when timeframe changes

  const handleTimeFrameChange = (event, newValue) => {
    setLoading(true);
    setTimeFrame(newValue);
  };

  // Find current user's rank
  const getCurrentUserRank = () => {
    const userIndex = leaderboardData.findIndex(user => user.isCurrentUser);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  return (
    <Box className="leaderboard-container" sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        <EmojiEventsIcon></EmojiEventsIcon> Leaderboard 
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Complete habits and earn points to climb the rankings
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 1, backgroundColor: 'background.paper' }}>
        <Tabs
          value={timeFrame}
          onChange={handleTimeFrameChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="leaderboard time frame tabs"
        >
          <Tab value="daily" label="Daily" />
          <Tab value="weekly" label="Weekly" />
          <Tab value="monthly" label="Monthly" />
          <Tab value="allTime" label="All Time" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Top 3 Winners Highlight Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap',
            gap: 2,
            mb: 4 
          }}>
            {leaderboardData.slice(0, 3).map((user, index) => (
              <Card 
                key={user.id} 
                elevation={1}
                sx={{ 
                  flex: '1 1 calc(33.333% - 16px)',
                  minWidth: isMobile ? '100%' : '200px',
                  borderRadius: 1,
                  backgroundColor: user.isCurrentUser ? 'rgba(66, 133, 244, 0.05)' : 'background.paper',
                  border: user.isCurrentUser ? '1px solid #4285F4' : 'none',
                  transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 3
                }}>
                  <Box sx={{ 
                    position: 'relative',
                    mb: 2
                  }}>
                    <Avatar 
                      src={user.avatar}
                      alt={user.name}
                      sx={{ 
                        width: 70, 
                        height: 70,
                        border: index === 0 ? '4px solid #FFD700' : 
                              index === 1 ? '4px solid #C0C0C0' : 
                              '4px solid #CD7F32'
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: -10,
                      right: -10,
                      backgroundColor: index === 0 ? '#FFD700' : 
                                      index === 1 ? '#C0C0C0' : 
                                      '#CD7F32',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      color: '#000',
                      boxShadow: 1
                    }}>
                      {index + 1}
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {user.points} points
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip 
                      icon={<CheckCircleIcon fontSize="small" />} 
                      label={`${user.completedHabits} habits`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<WatchLaterIcon fontSize="small" />} 
                      label={`${user.streak} day streak`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Rest of the leaderboard */}
          <Paper elevation={1} sx={{ borderRadius: 1, overflow: 'hidden', backgroundColor: 'background.paper' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Rankings
              </Typography>
            </Box>
            {leaderboardData.slice(3).map((user, index) => (
              <Box 
                key={user.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  backgroundColor: user.isCurrentUser ? 'rgba(66, 133, 244, 0.05)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    minWidth: 30, 
                    fontWeight: 'bold',
                    color: 'text.secondary' 
                  }}
                >
                  {index + 4}
                </Typography>
                <Avatar 
                  src={user.avatar} 
                  alt={user.name}
                  sx={{ mx: 2, width: 40, height: 40 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: user.isCurrentUser ? 'bold' : 'regular' }}>
                    {user.name}
                    {user.isCurrentUser && (
                      <Chip 
                        label="You" 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                      />
                    )}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    mt: 0.5
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      {user.points} points
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                      {user.completedHabits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <WatchLaterIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                      {user.streak}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Your current rank section */}
          {getCurrentUserRank() && (
            <Paper 
              elevation={1} 
              sx={{ 
                mt: 4, 
                p: 2, 
                borderRadius: 1,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" align="center">
                  Your Current Rank: #{getCurrentUserRank()} of {leaderboardData.length}
                </Typography>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}