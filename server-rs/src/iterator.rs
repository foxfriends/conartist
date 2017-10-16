pub struct PairedIter<I> {
    iter: I,
}

impl<I> Iterator for PairedIter<I> where I: Iterator {
    type Item = (I::Item, I::Item);

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().and_then(|a| self.iter.next().map(|b| (a, b)))
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        let (lower, upper) = self.iter.size_hint();
        (lower, upper.map(|x| x / 2))
    }
}

pub trait Paired: Sized {
    fn paired(self) -> PairedIter<Self> { PairedIter{ iter: self } }
}
impl <I: Iterator> Paired for I {}
