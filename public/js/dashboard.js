window.jsPDF = window.jspdf.jsPDF;

// Calendar
document.addEventListener('DOMContentLoaded', function () {

  const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    refetchResourcesOnNavigate: true,
    contentHeight: 'auto',
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'resourceTimelineMonth',
    nowIndicator: true,
    slotMinWidth: 30,

    // Print button + Today button
    customButtons: {
      printButton: {
        text: 'Print',
        click: function() {
          window.print();
          document.margin='none';
        }
      },
      todayButton: {
        text: 'Today',
        click: function() {
          calendar.today();
        }
      }
    },

    // Toolbar buttons header
    headerToolbar: {
      left: 'title',
      right: 'printButton todayButton prev,next',
    },

    slotLabelFormat:[{day: 'numeric'},{weekday: 'short'}],
    resourceAreaWidth: '25%',
    resourceAreaColumns: [
        {
            headerContent: 'Student Name',
            field: 'name',
            width: '190px'
        },
        {
            group: true,
            headerContent: 'Site',
            field: 'site',
            width: '65px'
        },
        {
            headerContent: 'Total',
            field: 'totalshifts',
            width: '48px'
        }
    ],
    resources: {
        url: './data/dashboardStudentSites'
    },
    events: {
        url: './data/dashboardShifts'
    },
    resourceLabelDidMount: (info) => {
        info.el.addEventListener("click", () => { 
            toggleHighlight(info)
         });
     },
     selectable: true,
});

const toggleHighlight = (info) => {
  const resourceId = info.el.getAttribute('data-resource-id'); 
  const elementsToHighlight = document.querySelectorAll(`[data-resource-id="${resourceId}"]`);
  elementsToHighlight.forEach((el) => {
    el.classList.toggle('highlighted');
  });
};
calendar.render();
});


