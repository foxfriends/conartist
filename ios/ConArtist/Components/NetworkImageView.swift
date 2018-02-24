//
//  NetworkImageView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class NetworkImageView: UIImageView {
    private let disposeBag = DisposeBag()

    private let øimageURL = Variable<String?>(nil)
    @IBInspectable var imageURL: String? {
        get { return øimageURL.value }
        set { øimageURL.value = imageURL }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        doInit()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        doInit()
    }

    private func doInit() {
        øimageURL.asObservable()
            .bindMap(URL.init(string:))
            .flatBindMap(ConArtist.API.Images.load(url:))
            .asDriver(onErrorJustReturn: nil)
            .drive(rx.image)
            .disposed(by: disposeBag)
    }
}
