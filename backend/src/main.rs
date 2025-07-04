use bcrypt::Version;
use bcrypt::hash_with_result;

fn main() {
    let hash = hash_with_result("assword123", 10)
        .unwrap()
        .format_for_version(Version::TwoA);

    let mut split = hash.split('$').skip(1);

    let algo = split.next().unwrap();
    let cost = split.next().unwrap();
    let rest = split.next().unwrap();

    println!("rest: {}", rest);

    let salt = &rest[..22];
    let hash = &rest[22..];

    println!("hash: {}, salt: {}", hash, salt);
}
