//
//  NetworkImageView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

// TODO: show a loading thing when these are loading
class NetworkImageView: UIImageView {
    private let disposeBag = DisposeBag()

    private let øimageId = Variable<String?>(nil)
    @IBInspectable var imageId: String? {
        get { return øimageId.value }
        set { øimageId.value = newValue }
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
        øimageId.asObservable()
            .flatBindMap(ConArtist.API.Images.load(imageId:))
            .asDriver(onErrorJustReturn: nil)
            .drive(rx.image)
            .disposed(by: disposeBag)
    }
}
