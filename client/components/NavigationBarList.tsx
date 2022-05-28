import classes from "../styles/NavigationBar.module.scss";

interface Props {
  items: String[];
}

const NavigationBarList = (props: any) => (
  <div className={classes.listContainer}>
    <div className={`${classes.activeEntry} ${classes.entryContainer}`}>
      <text>placeholder</text>
    </div>
    <div className={`${classes.activeEntry} ${classes.entryContainer}`}>
      <text>placeholder</text>
    </div>
    <div className={` ${classes.entryContainer}`}>
      <text>placeholder</text>
    </div>
  </div>
);

export default NavigationBarList;
