import { getAllDetailedEvents } from "./scrape.js";
import { writeFileSync } from "fs";
import { createEvents } from "ics";

async function createICS() {
  try {
    let events = await getAllDetailedEvents();
    if (!events.length) throw new Error("No events retrieved");

    let currentDateTime = new Date();
    let dateTimestr = currentDateTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/Toronto",
      timeZoneName: "short",
    });

    events = events.map((event) => {
      let date = new Date(parseInt(event.date) * 1000);
      let start = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ];
      let duration = { hours: 3 };
      let title = event.name;
      let description = "";
      if (event.fightCard.length)
        description += event.fightCard.join("\n") + "\n";
      if (event.mainCard.length)
        description +=
          "Main Card\n----------\n" + event.mainCard.join("\n") + "\n";
      if (event.prelims.length)
        description +=
          "\nPrelims\n----------\n" + event.prelims.join("\n") + "\n";
      description += "\n" + event.url;
      description += "\n\nAccurate as of " + dateTimestr;
      let location = event.location;
      let uid = event.url;
      let calName = "UFC";
      return {
        start,
        duration,
        title,
        description,
        location,
        uid,
        calName,
      };
    });

    console.log("\nDetailed events:");
    console.log(events);
    writeFileSync(`UFC.ics`, createEvents(events).value);
  } catch (error) {
    console.error(error);
  }
}

createICS();
