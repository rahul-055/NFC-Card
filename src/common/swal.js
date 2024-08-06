import Swal from 'sweetalert2';

export function Success(message) {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: message,
    showCloseButton: true,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    background: 'green',
    color: "white",
    // iconColor: "white"
  })
}

export function Error(message) {
  Swal.fire({
    position: 'top-end',
    icon: 'error',
    title: message,
    showCloseButton: true,
    showConfirmButton: false,
    timer: 5000,
    toast: true,
    background: '#E23F33',
    color: "white",
    iconColor: "#E29F99"
  })
}