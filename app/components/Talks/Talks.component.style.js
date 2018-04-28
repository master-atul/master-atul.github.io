import theme from '../../style/theme';
export default {
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: theme.backgroundWhite,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center'
  },
  titleContainer: {
    display: 'flex'
  },
  icon: {
    fill: theme.linkedInBlue,
    size: 40
  },
  title: {
    fontWeight: 300,
    fontSize: '2em',
    paddingTop: 10,
    paddingRight: 10
  },
  description: {
    fontStyle: 'italic',
    padding: 10,
    textAlign: 'center',
    fontWeight: 300
  },
  talkTitle: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    padding: '20px',
    color: theme.tileGreen,
  },
  talkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};
