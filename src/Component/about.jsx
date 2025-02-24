import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const About = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#f5f5f5' }}>
        {/* About Us Section */}
        <Box mb={4}>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            About Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to <b>QuizNest.com</b>! We are dedicated to providing
            engaging and educational quiz content for users worldwide. Our
            mission is to inspire curiosity and foster learning through
            interactive quizzes.
          </Typography>
        </Box>

        {/* Our Team Section */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="secondary"
          >
            Our Team
          </Typography>
          <Grid container spacing={3}>
            {[
              { role: 'CEO', name: 'HatLEriya' },
              { role: 'Founder', name: 'EmonJyoti' },
              { role: 'CTO', name: 'Banjit' },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {member.role}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {member.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Our Branches */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="secondary"
          >
            Our Branches
          </Typography>
          <List>
            {['Mongoldoi', 'Udalguri', 'Namkhala'].map((branch, index) => (
              <ListItem key={index}>
                <ListItemText primary={branch} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Features */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="secondary"
          >
            Features
          </Typography>
          <List>
            {[
              'Wide range of quiz topics',
              'Interactive and user-friendly interface',
              'Regular updates and new quizzes',
            ].map((feature, index) => (
              <ListItem key={index}>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Contact Us */}
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="secondary"
          >
            Contact Us
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Email: Emon@quiznest.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone: 87986521654" />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
