declare type i8 = number;
declare type i16 = number;
declare type i32 = number;
declare type u8 = number;
declare type u16 = number;
declare type u32 = number;
declare type f32 = number;
declare type f64 = number;
declare type bool = boolean;
declare type Null<T> = T | null;

interface String {
    replaceAll(searchValue: string | RegExp, replaceValue: string): string;
}
