const mongoose = require('mongoose');

async function updateInterviews() {
  try {
    await import('dotenv').then((dotenv) => dotenv.config({ path: '.env.local' }));
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'interviewDB' });
    console.log('Connected to MongoDB');

    const Interview = mongoose.model('Interview', new mongoose.Schema({}, { strict: false }));

    const topicQuestions = {
      'Responsive Design': [
        { question: 'What is responsive design?', answer: 'Adapts to screen sizes.', score: 50, feedback: 'Explain fluid layouts.' },
        { question: 'How do media queries work?', answer: 'CSS rules for screens.', score: 50, feedback: 'Include syntax.' },
        { question: 'What are common breakpoints?', answer: 'Mobile, tablet, desktop.', score: 50, feedback: 'List sizes.' },
        { question: 'How does flexbox aid responsive design?', answer: 'Flexible layouts.', score: 50, feedback: 'Discuss properties.' },
        { question: 'What is a mobile-first approach?', answer: 'Design for mobile.', score: 50, feedback: 'Explain benefits.' },
        { question: 'How do you handle responsive images?', answer: 'Use srcset.', score: 50, feedback: 'Mention techniques.' },
        { question: 'What is the viewport meta tag?', answer: 'Controls viewport.', score: 50, feedback: 'Show syntax.' },
        { question: 'How do you test responsiveness?', answer: 'Use dev tools.', score: 50, feedback: 'List tools.' },
        { question: 'What are CSS units like vw and rem?', answer: 'Relative units.', score: 50, feedback: 'Compare units.' },
        { question: 'How do you ensure cross-browser compatibility?', answer: 'Test browsers.', score: 50, feedback: 'Discuss challenges.' },
        { question: 'What is a fluid layout?', answer: 'Adapts to width.', score: 50, feedback: 'Explain examples.' },
        { question: 'How does grid layout help?', answer: 'Grid-based layouts.', score: 50, feedback: 'Discuss properties.' },
        { question: 'What are responsive typography techniques?', answer: 'Use clamp().', score: 50, feedback: 'Explain clamp().' },
        { question: 'How do you handle responsive navigation?', answer: 'Burger menus.', score: 50, feedback: 'Discuss patterns.' },
        { question: 'What is the picture element?', answer: 'Responsive images.', score: 50, feedback: 'Explain use cases.' },
        { question: 'How do you optimize mobile performance?', answer: 'Minify CSS.', score: 50, feedback: 'List techniques.' },
        { question: 'What is adaptive vs. responsive design?', answer: 'Fixed vs. fluid.', score: 50, feedback: 'Compare approaches.' },
        { question: 'How do you handle touch events?', answer: 'Use touchstart.', score: 50, feedback: 'Discuss events.' },
        { question: 'How do you test across devices?', answer: 'Use emulators.', score: 50, feedback: 'Mention tools.' },
        { question: 'How do you use CSS frameworks for RWD?', answer: 'Bootstrap, Tailwind.', score: 50, feedback: 'List frameworks.' },
      ],
      'CSS': [
        { question: 'What is the box model?', answer: 'Content, padding, border.', score: 50, feedback: 'Explain components.' },
        { question: 'What are CSS selectors?', answer: 'Target elements.', score: 50, feedback: 'List types.' },
        { question: 'How does specificity work?', answer: 'Weight-based rules.', score: 50, feedback: 'Explain rules.' },
        { question: 'What is margin vs. padding?', answer: 'Outside vs. inside.', score: 50, feedback: 'Compare.' },
        { question: 'What are pseudo-classes?', answer: 'Dynamic states.', score: 50, feedback: 'Give examples.' },
        { question: 'What is z-index?', answer: 'Stacking order.', score: 50, feedback: 'Explain stacking.' },
        { question: 'How do you center an element?', answer: 'Flex, grid.', score: 50, feedback: 'List methods.' },
        { question: 'What is CSS Grid?', answer: '2D layout system.', score: 50, feedback: 'Discuss properties.' },
        { question: 'What is Flexbox?', answer: '1D layout system.', score: 50, feedback: 'Explain use cases.' },
        { question: 'What are CSS variables?', answer: 'Custom properties.', score: 50, feedback: 'Show syntax.' },
        { question: 'How do you handle animations?', answer: 'Use keyframes.', score: 50, feedback: 'Discuss keyframes.' },
        { question: 'What is relative vs. absolute positioning?', answer: 'Relative to parent.', score: 50, feedback: 'Compare.' },
        { question: 'What are media queries?', answer: 'Responsive CSS.', score: 50, feedback: 'Explain syntax.' },
        { question: 'How do you optimize CSS performance?', answer: 'Minify CSS.', score: 50, feedback: 'List techniques.' },
        { question: 'What is the cascade?', answer: 'Style precedence.', score: 50, feedback: 'Explain rules.' },
        { question: 'What are vendor prefixes?', answer: 'Browser support.', score: 50, feedback: 'Give examples.' },
        { question: 'How do you use preprocessors?', answer: 'SASS, LESS.', score: 50, feedback: 'Mention SASS.' },
        { question: 'What is BEM methodology?', answer: 'Block-Element-Modifier.', score: 50, feedback: 'Explain structure.' },
        { question: 'How do you handle CSS resets?', answer: 'Normalize.css.', score: 50, feedback: 'Discuss approaches.' },
        { question: 'What are CSS frameworks?', answer: 'Bootstrap, Tailwind.', score: 50, feedback: 'List examples.' },
      ],
      'Angular': [
        { question: 'What is Angular?', answer: 'Frontend framework.', score: 50, feedback: 'Explain features.' },
        { question: 'What are components?', answer: 'UI building blocks.', score: 50, feedback: 'Discuss structure.' },
        { question: 'What is two-way binding?', answer: 'Sync data.', score: 50, feedback: 'Explain mechanism.' },
        { question: 'What are directives?', answer: 'Extend HTML.', score: 50, feedback: 'List types.' },
        { question: 'What is dependency injection?', answer: 'Service sharing.', score: 50, feedback: 'Explain DI.' },
        { question: 'What is Angular CLI?', answer: 'Build tool.', score: 50, feedback: 'Discuss commands.' },
        { question: 'What are modules?', answer: 'Organize app.', score: 50, feedback: 'Explain NgModule.' },
        { question: 'What is a service?', answer: 'Reusable logic.', score: 50, feedback: 'Discuss use cases.' },
        { question: 'How do you handle routing?', answer: 'RouterModule.', score: 50, feedback: 'Explain routing.' },
        { question: 'What are pipes?', answer: 'Transform data.', score: 50, feedback: 'List examples.' },
        { question: 'What is RxJS?', answer: 'Reactive programming.', score: 50, feedback: 'Explain Observables.' },
        { question: 'How do you optimize performance?', answer: 'Lazy loading.', score: 50, feedback: 'List techniques.' },
        { question: 'What is change detection?', answer: 'UI updates.', score: 50, feedback: 'Explain strategies.' },
        { question: 'What are forms?', answer: 'Reactive, template.', score: 50, feedback: 'Compare types.' },
        { question: 'How do you handle HTTP?', answer: 'HttpClient.', score: 50, feedback: 'Discuss usage.' },
        { question: 'What is Angular Universal?', answer: 'SSR for Angular.', score: 50, feedback: 'Explain SSR.' },
        { question: 'How do you test Angular apps?', answer: 'Jasmine, Karma.', score: 50, feedback: 'Mention tools.' },
        { question: 'What are animations?', answer: 'UI transitions.', score: 50, feedback: 'Discuss syntax.' },
        { question: 'What is lazy loading?', answer: 'Load on demand.', score: 50, feedback: 'Explain benefits.' },
        { question: 'How do you secure Angular apps?', answer: 'Sanitization.', score: 50, feedback: 'List practices.' },
      ],
      'Vue.js': [
        { question: 'What is Vue.js?', answer: 'Frontend framework.', score: 50, feedback: 'Explain features.' },
        { question: 'What are components?', answer: 'UI building blocks.', score: 50, feedback: 'Discuss structure.' },
        { question: 'What is the Vue instance?', answer: 'App core.', score: 50, feedback: 'Explain lifecycle.' },
        { question: 'What are directives?', answer: 'Extend HTML.', score: 50, feedback: 'List examples.' },
        { question: 'How does reactivity work?', answer: 'Data binding.', score: 50, feedback: 'Explain mechanism.' },
        { question: 'What is Vue Router?', answer: 'Navigation.', score: 50, feedback: 'Discuss routing.' },
        { question: 'What is Vuex?', answer: 'State management.', score: 50, feedback: 'Explain store.' },
        { question: 'How do you handle events?', answer: 'Use v-on.', score: 50, feedback: 'Discuss events.' },
        { question: 'What are slots?', answer: 'Content distribution.', score: 50, feedback: 'Explain use cases.' },
        { question: 'How do you optimize performance?', answer: 'Lazy loading.', score: 50, feedback: 'List techniques.' },
        { question: 'What is Composition API?', answer: 'Flexible API.', score: 50, feedback: 'Compare with Options API.' },
        { question: 'What are mixins?', answer: 'Reusable code.', score: 50, feedback: 'Discuss pros and cons.' },
        { question: 'How do you handle forms?', answer: 'Use v-model.', score: 50, feedback: 'Explain binding.' },
        { question: 'What is Vue CLI?', answer: 'Build tool.', score: 50, feedback: 'Discuss commands.' },
        { question: 'How do you test Vue apps?', answer: 'Jest, Cypress.', score: 50, feedback: 'Mention tools.' },
        { question: 'What are transitions?', answer: 'UI animations.', score: 50, feedback: 'Discuss syntax.' },
        { question: 'How do you handle HTTP?', answer: 'Use Axios.', score: 50, feedback: 'Discuss usage.' },
        { question: 'What is Vue SSR?', answer: 'Server-side rendering.', score: 50, feedback: 'Explain Nuxt.js.' },
        { question: 'How do you secure Vue apps?', answer: 'Sanitization.', score: 50, feedback: 'List practices.' },
        { question: 'What are computed properties?', answer: 'Dynamic values.', score: 50, feedback: 'Explain use cases.' },
      ],
    };

    const interviews = await Interview.find({ userId: 'user_2zSeFf0zY5Ogk6M5FnWd9BFjZVN' });
    for (const interview of interviews) {
      // Correct topics (remove incorrect ones like 'React')
      const validTopics = interview.topics.filter(t => ['Responsive Design', 'CSS', 'Angular', 'Vue.js'].includes(t));
      interview.topics = validTopics.length > 0 ? validTopics : ['CSS', 'Responsive Design'];

      // Update feedback
      const feedback = interview.feedback ? JSON.parse(interview.feedback) : {
        strengths: ['Completed the interview', 'Good effort'],
        improvements: ['Provide detailed answers', 'Practice technical terms'],
        score: interview.score || 50,
        detailedAnalysis: `Based on ${interview.topics.length * 20} responses with an average score of 50%.`,
        questionScores: [],
        resources: [
          { title: 'Frontend Interview Prep', description: `Guide for ${interview.topics.join(', ')}.` },
          { title: 'Technical Skills', description: 'Improve technical explanations.' },
        ],
      };

      // Clear existing questions and add 20 per topic
      feedback.questionScores = [];
      for (const topic of interview.topics) {
        const questions = topicQuestions[topic] || [];
        feedback.questionScores = [...feedback.questionScores, ...questions];
      }

      // Update score and analysis
      feedback.score = interview.score || 50;
      interview.score = feedback.score;
      feedback.detailedAnalysis = `Based on ${feedback.questionScores.length} responses with an average score of ${feedback.score}%.`;

      interview.feedback = JSON.stringify(feedback);
      await interview.save();
      console.log(`Updated interview ${interview._id} with ${feedback.questionScores.length} questions`);
    }

    console.log('Update complete');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error updating interviews:', error.message);
  }
}

updateInterviews();