import cron from 'cron';
import commitsFetcher from './commits-fetcher';

const {
  CronJob
} = cron;

let updateContributionsDaily = () => {
    new CronJob('0 0 * * * *', () => {
        commitsFetcher.run();
    }, () => {
        console.log('Contributions updated!');
    }, true, 'America/Los_Angeles');
}
