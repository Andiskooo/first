// Blog post data types and mock data
export type BlogPost = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  fullContent: string; // Added full content parameter
  imageUrl: string;
  link: string;
  date?: string;
  accentColor?: string; // Optional color for accents
};

// Mock blog data
export const blogPosts: BlogPost[] = [
  {
    id: '01',
    title: 'How to Connect Your Candy Smart AC to Wi-Fi',
    subtitle: 'A Step-by-Step Guide',
    content: "Easily connect your Candy Smart air conditioner to Wi-Fi using the hOn app. Follow this guide for seamless control and smart features.",
    fullContent: `
      ## Connecting Your Candy Smart AC to Wi-Fi: A Comprehensive Guide

      This guide will walk you through the process of connecting your Candy Smart air conditioner to your home's Wi-Fi network using the "hOn" application. With a successful connection, you can control your AC remotely and unlock smart features.

      ### Prerequisites

      Before you begin, make sure you have the following:

      *   A Candy Smart air conditioner (compatible models)
      *   A smartphone (iOS 9.0 or later, or Android 5.0 or later)
      *   A stable Wi-Fi network and password
      *   The "hOn" app installed on your smartphone (available on the App Store and Google Play)

      ### Step-by-Step Instructions

      1.  **Activate Wi-Fi Connection Mode on Your AC:**

          *   Locate the "LIGHT" button on your air conditioner's control panel.
          *   Press and hold the "LIGHT" button for approximately 5 seconds.
          *   The air conditioner will begin transmitting a Wi-Fi signal, indicating that it's ready to pair.

      2.  **Launch the "hOn" App and Follow the On-Screen Instructions:**

          *   Open the "hOn" app on your smartphone.
          *   The app will automatically detect the air conditioner and guide you through the pairing process.
          *   Follow the prompts and enter your Wi-Fi network credentials when required.

      3.  **Complete the Connection:**

          *   The app will establish the connection between your air conditioner and your Wi-Fi network.
          *   Once the connection is successful, you can control your AC remotely using the app.

      ### Troubleshooting

      *   If you encounter any issues during the connection process, ensure that your smartphone is connected to the correct Wi-Fi network and that your password is correct.
      *   If the problem persists, consult the "hOn" app's help section or contact Candy customer support.

      ### Enjoy Smart Features

      After successfully connecting your Candy Smart air conditioner to Wi-Fi, you can enjoy a variety of smart features, including:

      *   Remote control of temperature and settings
      *   Scheduling and timer functions
      *   Energy monitoring and usage reports
      *   Error notifications and maintenance reminders
    `,
    imageUrl: '/featured/pompa-termike.jpg',
    link: '/blog/candy-smart-wifi',
    accentColor: 'red-600'
  },
  {
    id: '02',
    title: 'Why is My Air Conditioner Smelling Like Dirty Socks?',
    subtitle: 'Common Causes and Solutions',
    content: "That unpleasant odor from your AC might be more than just annoying. Learn about the common causes and how to fix the 'dirty sock syndrome'.",
    fullContent: `
      ## Why Your Air Conditioner Smells Like Dirty Socks and What to Do About It

      Have you noticed a musty, unpleasant odor coming from your air conditioner? If it smells like dirty socks, you're likely experiencing a common problem known as "dirty sock syndrome." This isn't just an annoyance; it can indicate underlying issues with your AC system.

      ### Common Causes of Dirty Sock Syndrome

      *   **Mold and Bacteria Growth:** The most common cause is the growth of mold, mildew, and bacteria on the evaporator coil inside your air conditioner. This coil is constantly exposed to moisture, creating a perfect breeding ground for these organisms.
      *   **Dirty Air Filters:** Clogged or dirty air filters restrict airflow and allow dust, dirt, and other particles to accumulate on the evaporator coil, further contributing to the growth of mold and bacteria.
      *   **Standing Water:**  If the drain pan that collects condensation is clogged or improperly sloped, water can stagnate and become a breeding ground for mold and bacteria.
      *   **Dirty Ductwork:** In some cases, the source of the odor may be in the ductwork itself, where dust, debris, and mold can accumulate over time.

      ### Solutions to Eliminate the Odor

      *   **Replace or Clean Air Filters:**  This is the first and most important step. Replace your air filters regularly (every 1-3 months) and consider using high-efficiency filters to capture more particles.
      *   **Professional Cleaning:** A professional AC technician can thoroughly clean the evaporator coil with specialized cleaning solutions to kill mold and bacteria.
      *   **Drain Pan Cleaning:** Clean the drain pan regularly to prevent standing water. You can use a mixture of bleach and water to disinfect the pan.
      *   **Duct Cleaning:** If the odor persists, consider having your ductwork professionally cleaned to remove dust, debris, and mold.
      *   **UV Light Installation:**  A UV light installed inside your air handler can help kill mold and bacteria on the evaporator coil.

      ### Prevention Tips

      *   **Regular Maintenance:** Schedule annual maintenance for your air conditioner to keep it clean and in good working order.
      *   **Use High-Efficiency Filters:**  High-efficiency filters capture more particles and help prevent buildup on the evaporator coil.
      *   **Keep the Area Clean:**  Keep the area around your outdoor unit clean and free of debris.

      If you've tried these steps and the odor persists, it's best to consult with a qualified HVAC technician to diagnose and resolve the problem. A professional can identify the source of the odor and recommend the most effective solution.
    `,
    imageUrl: '/featured/tpompa-termike.jpg',
    link: '/blog/dirty-sock-ac',
    accentColor: 'blue-600'
  },
  {
    id: '03',
    title: '5 Reasons Why Your Air Conditioner Might Be Leaking Water',
    subtitle: 'Troubleshooting Guide',
    content: "Is your AC dripping water? Don't ignore it! Here's a breakdown of the common causes and how to address this issue before it leads to bigger problems.",
    fullContent: `
      ## 5 Reasons Why Your Air Conditioner Is Leaking Water and What to Do

      A leaking air conditioner can be a sign of a serious problem. If you notice water dripping from your indoor unit or pooling around your outdoor unit, it's important to address the issue promptly. Here are five common reasons why your air conditioner might be leaking water:

      ### 1. Clogged Drain Line

      *   **Problem:** The drain line carries condensation away from the evaporator coil. If it becomes clogged with debris, algae, or mold, water can back up and leak from the unit.
      *   **Solution:** Try clearing the drain line yourself using a wet/dry vacuum or a stiff wire. You can also pour a mixture of bleach and water down the drain line to kill algae and mold. If you're unable to clear the clog, call a professional HVAC technician.

      ### 2. Dirty Air Filter

      *   **Problem:** A dirty air filter restricts airflow over the evaporator coil, causing it to become too cold. This can lead to ice formation, which melts and drips when the AC is turned off.
      *   **Solution:** Replace your air filter regularly (every 1-3 months). This will improve airflow and prevent ice formation.

      ### 3. Low Refrigerant

      *   **Problem:** Low refrigerant can also cause the evaporator coil to become too cold and freeze up.
      *   **Solution:** Contact a qualified HVAC technician to check the refrigerant level and add refrigerant if necessary. Low refrigerant often indicates a leak, which needs to be repaired.

      ### 4. Cracked Drain Pan

      *   **Problem:** The drain pan collects condensation from the evaporator coil. If it's cracked or damaged, water can leak out.
      *   **Solution:** Inspect the drain pan for cracks or damage. If you find any, replace the drain pan.

      ### 5. Improper Installation

      *   **Problem:** An improperly installed air conditioner may not be level, causing condensation to overflow the drain pan.
      *   **Solution:** Contact a qualified HVAC technician to inspect the installation and ensure that the unit is level.

      ### When to Call a Professional

      If you're unable to identify the cause of the leak or if you're uncomfortable working with your air conditioner, it's best to call a qualified HVAC technician. A professional can diagnose the problem accurately and provide the necessary repairs. Ignoring a leaking air conditioner can lead to further damage and costly repairs down the line.
    `,
    imageUrl: '/featured/klima.jpg',
    link: '/blog/ac-leaking-water',
    accentColor: 'green-600'
  },
  {
    id: '04',
    title: 'Extend The Life Of Your AC',
    subtitle: 'Tips and Tricks',
    content: "Protect your investment! Follow these simple steps to keep your air conditioner running efficiently and reliably for years to come.",
    fullContent: `
    ## Extend the Life of Your Air Conditioner: Practical Tips and Tricks

    Your air conditioner is a significant investment, and proper care and maintenance can significantly extend its lifespan and ensure optimal performance. Here's a comprehensive guide to help you keep your AC running efficiently and reliably for years to come.

    ### 1. Regular Air Filter Replacement

    *   **Why:** Dirty air filters restrict airflow, forcing your AC to work harder, which leads to increased energy consumption and premature wear and tear on components.
    *   **How Often:** Replace your air filters every 1-3 months, depending on usage and the type of filter.
    *   **Tip:** Use a calendar reminder to help you stay on track.

    ### 2. Clean the Outdoor Unit

    *   **Why:** Debris like leaves, grass clippings, and dirt can accumulate around the outdoor unit, restricting airflow and reducing efficiency.
    *   **How To:** Regularly clear away any debris around the unit, ensuring that there is at least 2-3 feet of clearance.

    ### 3. Schedule Professional Maintenance

    *   **Why:** A professional HVAC technician can inspect your AC system, identify potential problems, and perform necessary maintenance tasks to keep it running smoothly.
    *   **How Often:** Schedule annual maintenance in the spring before the cooling season begins.

    ### 4. Clean the Evaporator Coil

    *   **Why:** The evaporator coil, located inside your indoor unit, can accumulate dust and dirt over time, reducing its ability to absorb heat.
    *   **How To:** Hire a professional to clean the evaporator coil.

    ### 5. Keep the Condensate Drain Clear

    *   **Why:** The condensate drain line can become clogged with algae and mold, leading to water leaks and potential damage.
    *   **How To:** Periodically pour a mixture of bleach and water down the drain line to kill algae and mold.

    ### 6. Check Ductwork for Leaks

    *   **Why:** Leaky ductwork can result in significant energy loss, as cooled air escapes before reaching its intended destination.
    *   **How To:** Seal any visible leaks in your ductwork with duct tape or mastic sealant. Consider having your ductwork professionally inspected and sealed.

    ### 7. Use Programmable Thermostat

    *   **Why:** A programmable thermostat allows you to set different temperatures for different times of the day, reducing energy consumption when you're not home or sleeping.
    *   **How To:** Program your thermostat to raise the temperature a few degrees when you're away or asleep.

    ### 8. Don't Block Air Vents

    *   **Why:** Blocking air vents restricts airflow and forces your AC to work harder.
    *   **How To:** Make sure that furniture, curtains, and other objects are not blocking air vents.

    ### 9. Keep Windows and Doors Sealed

    *   **Why:** Gaps around windows and doors allow cool air to escape and warm air to enter, increasing energy consumption.
    *   **How To:** Seal any gaps around windows and doors with weatherstripping or caulk.

    ### 10. Consider a Whole-House Fan

    *   **Why:** A whole-house fan can help to cool your home at night by drawing in cooler outside air.
    *   **How To:** Use a whole-house fan in conjunction with your AC to reduce energy consumption.
    `,
    imageUrl: '/featured/bojleri.jpg',
    link: '/blog/extend-ac-life',
    accentColor: 'orange-600'
  },
];