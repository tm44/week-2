const { Router } = require("express");

const CalendarDAO = require('../daos/calendars');

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const calendars = await CalendarDAO.getAll();
    res.json(calendars);
  } catch(e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.getById(req.params.id);
    if (calendar) {
      res.json(calendar);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.getById(req.params.id);
    if (!calendar) {
      res.status(404).send('No calendar found');
      return;
    }
    const updatedCalendar = await CalendarDAO.updateById(req.params.id, req.body);
    res.json(updatedCalendar);
  }
  catch (e) {
    if (e.message.includes('validation') || e.message.includes('schema')) {
      res.status(400).send(e.message);
    }
    else {
      res.status(500).send(e.message);
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.getById(req.params.id);
    if (!calendar) {
      res.status(404).send('Calendar not found');
      return;
    }
    await CalendarDAO.removeById(req.params.id);
    res.sendStatus(200);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const calendar = req.body;
    if (!calendar || JSON.stringify(calendar) === '{}') {
      res.status(400).send('Calendar is required');
    }
    else {
      const savedCalendar = await CalendarDAO.create(calendar);
      res.json(savedCalendar);
    }
  } catch (e) {
    if (e.message.includes('validation') || e.message.includes('schema')) {
      res.status(400).send(e.message);
    }
    else {
      res.status(500).send(e.message);
    }
  }
})

module.exports = router;
